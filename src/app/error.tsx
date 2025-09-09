'use client';

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
} : {
    error: Error & {digest?: string}
    reset: () => void;
}) {
    useEffect(() => {
        //Log the error so we can see details in the console
        console.log('App error boundary:', error);
    }, [error])

    return (
        <>
        <body className="grid min-h-[60vh] place-items-center p-6">
            <div className="space-y-4 text-center">
                <h1 className="text-2xl font-semibold">Something went wrong</h1>
                <p className="text-gray-600">Please try again</p>
                <button
                onClick={() => reset()}
                className="border rounded px-4 py-2"
                >
                    Try again
                </button>
            </div>
        </body>
        </>
    )
}