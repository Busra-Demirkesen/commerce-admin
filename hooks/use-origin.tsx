import { useState, useEffect} from 'react';

export const useOrigin = () =>{
    const [mounted, setMounted] = useState(false);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    
    useEffect(() => {
        setMounted(true);
    }, []);

    return (!mounted ? '' : origin);
}