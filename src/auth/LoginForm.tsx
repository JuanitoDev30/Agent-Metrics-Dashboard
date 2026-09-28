import { useState, type FormEvent } from "react";

export function LoginForm(){
    const [key, setKey] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [checking, setChecking] = useState(false);
 
    

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const candidate = key.trim();
        if (!candidate) return

        setChecking(true);
        setError(null);

        try {
            // se prueba la clave antes de guardarla: si esta mal, el error
            // aparece aquim en el formulario y no despues dentro del panel
        } catch (error) {
            
        }
    }


}