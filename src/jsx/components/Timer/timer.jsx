import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const useIdleTimer = (timeout = 600000, onIdle) => { // Timeout 10 minutes
    const [isIdle, setIsIdle] = useState(false);

    useEffect(() => {
        let timer;

        const handleActivity = () => {
            if (isIdle) {
                setIsIdle(false);
            }
            clearTimeout(timer);
            timer = setTimeout(() => {
                setIsIdle(true);
                Swal.fire({
                    title: 'Session Expired',
                    text: 'You have been inactive for too long. You will be logged out.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                }).then(() => {
                    onIdle(); // Trigger the idle action
                });
            }, timeout);
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('scroll', handleActivity);
        window.addEventListener('click', handleActivity);

        timer = setTimeout(() => {
            setIsIdle(true);
            Swal.fire({
                title: 'Session Expired',
                text: 'You have been inactive for too long. You will be logged out.',
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(() => {
                onIdle(); // Trigger the idle action
            });
        }, timeout);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('scroll', handleActivity);
            window.removeEventListener('click', handleActivity);
        };
    }, [isIdle, timeout, onIdle]);

    return { isIdle };
};

export default useIdleTimer;
