import {
    APPEARANCE_STORAGE_KEY,
    applyAppearance,
    readAppearance,
    resolveAppearance,
    themeColorFor,
    writeAppearance,
} from './appearance';

beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark-mode');
    document.querySelector('meta[name="theme-color"]')?.remove();
});

test('resolves missing, empty, dark, and light stored values', () => {
    expect(resolveAppearance(null)).toBe('dark');
    expect(resolveAppearance('')).toBe('dark');
    expect(resolveAppearance('true')).toBe('dark');
    expect(resolveAppearance('false')).toBe('light');
    expect(resolveAppearance('unexpected')).toBe('dark');
});

test('reads the saved preference and defaults to dark', () => {
    expect(readAppearance()).toBe('dark');

    window.localStorage.setItem(APPEARANCE_STORAGE_KEY, 'false');
    expect(readAppearance()).toBe('light');

    window.localStorage.setItem(APPEARANCE_STORAGE_KEY, 'true');
    expect(readAppearance()).toBe('dark');
});

test('does not persist a choice when resolving the default', () => {
    expect(readAppearance()).toBe('dark');
    expect(window.localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBeNull();
});

test('treats unreadable storage as dark and still attempts explicit writes', () => {
    const setItem = jest.fn(() => {
        throw new Error('storage unavailable');
    });
    const brokenStorage = {
        getItem: () => {
            throw new Error('storage unavailable');
        },
        setItem,
    };

    expect(readAppearance(brokenStorage)).toBe('dark');
    expect(() => writeAppearance('light', brokenStorage)).not.toThrow();
    expect(setItem).toHaveBeenCalledWith(APPEARANCE_STORAGE_KEY, 'false');
});

test('writes the explicit appearance values', () => {
    writeAppearance('light');
    expect(window.localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('false');

    writeAppearance('dark');
    expect(window.localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('true');
});

test('applies the appearance class and theme color', () => {
    const themeColor = document.createElement('meta');
    themeColor.setAttribute('name', 'theme-color');
    document.head.appendChild(themeColor);

    applyAppearance('dark');
    expect(document.documentElement).toHaveClass('dark-mode');
    expect(themeColor).toHaveAttribute('content', themeColorFor('dark'));

    applyAppearance('light');
    expect(document.documentElement).not.toHaveClass('dark-mode');
    expect(themeColor).toHaveAttribute('content', themeColorFor('light'));
});
