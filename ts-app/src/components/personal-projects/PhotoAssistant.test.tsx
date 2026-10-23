import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import PhotoAssistant, { PhotoGuidanceResult } from "./PhotoAssistant";

const guidance: PhotoGuidanceResult = {
  summary: "A balanced portrait.",
  subjects: [],
  scenes: [],
  tips: [{ category: "Composition", text: "Leave more space above the subject." }],
  uncertain: false,
  notice: null,
  error_message: null,
};

const successfulResponse = (): Response =>
  ({ ok: true, json: async () => guidance } as Response);

const originalImage = window.Image;
const originalFetch = global.fetch;

beforeEach(() => {
  class LoadedImage {
    width = 800;
    height = 600;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    set src(_value: string) {
      this.onload?.();
    }
  }

  window.Image = LoadedImage as unknown as typeof Image;
  jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    drawImage: jest.fn(),
  } as unknown as CanvasRenderingContext2D);
  jest.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/jpeg;base64,dGVzdA==");
  global.fetch = jest.fn();
});

afterEach(() => {
  window.Image = originalImage;
  global.fetch = originalFetch;
  jest.restoreAllMocks();
  jest.useRealTimers();
});

async function selectPhoto() {
  const input = screen.getByLabelText(/click or drag a photo here/i);
  if (!(input instanceof HTMLInputElement)) throw new Error("Photo input not found.");
  const photo = new File(["photo"], "portrait.jpg", { type: "image/jpeg" });
  fireEvent.change(input, { target: { files: [photo] } });
  await screen.findByText("portrait.jpg");
}

test("submits a prepared photo to the configured Cloudflare endpoint and displays guidance", async () => {
  render(<PhotoAssistant workerUrl="https://assistant.example.workers.dev/" />);
  (global.fetch as jest.Mock).mockResolvedValue(successfulResponse());
  await selectPhoto();

  fireEvent.click(screen.getByRole("button", { name: "Review photo" }));

  expect(await screen.findByText("A balanced portrait.")).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(
    "https://assistant.example.workers.dev/",
    expect.objectContaining({ method: "POST", signal: expect.any(AbortSignal) }),
  );
});

test("shows a plain-language network error and allows retry without selecting the photo again", async () => {
  render(<PhotoAssistant workerUrl="https://assistant.example.workers.dev/" />);
  (global.fetch as jest.Mock)
    .mockRejectedValueOnce(new TypeError("Failed to fetch"))
    .mockResolvedValueOnce({ ok: false, json: async () => ({ error: "The service is busy." }) })
    .mockResolvedValueOnce(successfulResponse());
  await selectPhoto();

  fireEvent.click(screen.getByRole("button", { name: "Review photo" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Could not connect to the photo assistant. Check your connection and try again.",
  );
  expect(screen.getByText("portrait.jpg")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Review photo" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("The service is busy.");
  fireEvent.click(screen.getByRole("button", { name: "Review photo" }));
  expect(await screen.findByText("A balanced portrait.")).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(3);
});

test("reports unreadable responses and times out a slow review while preserving retry", async () => {
  render(<PhotoAssistant workerUrl="https://assistant.example.workers.dev/" />);
  const pendingResponse = new Promise<Response>(() => undefined);
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce({ ok: true, json: async () => ({ unexpected: true }) })
    .mockReturnValueOnce(pendingResponse)
    .mockResolvedValueOnce(successfulResponse());
  await selectPhoto();

  fireEvent.click(screen.getByRole("button", { name: "Review photo" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("returned an unreadable result");

  jest.useFakeTimers();
  fireEvent.click(screen.getByRole("button", { name: "Review photo" }));
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  await act(async () => {
    jest.advanceTimersByTime(30_000);
  });

  expect(screen.getByRole("alert")).toHaveTextContent("Photo review took too long. Please try again.");
  expect(screen.getByText("portrait.jpg")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Review photo" }));
  expect(await screen.findByText("A balanced portrait.")).toBeInTheDocument();
});
