import {useRef, useEffect} from "react";

/**
 * Method to utilise the previous value of the state hook in a
 * react functional component.
 * */
export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
