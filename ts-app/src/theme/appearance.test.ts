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

test('resolves missing, dark, and light stored values', () => {
    expect(resolveAppearance(null)).toBe('dark');
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

test('treats unreadable storage as dark', () => {
    const brokenStorage = {
        getItem: () => {
            throw new Error('storage unavailable');
        },
        setItem: () => {
            throw new Error('storage unavailable');
        },
    };

    expect(readAppearance(brokenStorage)).toBe('dark');
    expect(() => writeAppearance('light', brokenStorage)).not.toThrow();
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
