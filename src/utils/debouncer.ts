import { useEffect, useState } from "react";

const useDebounce = (value: string, delay = 500) => {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debounceValue;
};

export default useDebounce;
