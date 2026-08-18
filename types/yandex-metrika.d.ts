declare global {
    interface Window {
        [key: `disableYaCounter${number}`]: boolean | undefined;
    }
}

export {};
