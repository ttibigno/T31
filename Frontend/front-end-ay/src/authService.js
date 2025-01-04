export async function loginUser(username, password) {
    try {
        const response = await fetch('http://localhost:8000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        // Gestione degli errori di risposta
        if (!response.ok) {
            return {
                success: false,
                message: data.message || `Errore nel login (status: ${response.status})`,
            };
        }

        // Se il token è presente, salvalo
        if (data.accessToken) {
            localStorage.setItem('authToken', data.accessToken);
            console.log('Token salvato in localStorage:', data.accessToken);
            return { success: true }; // Login riuscito
        } else {
            return {
                success: false,
                message: 'Token non ricevuto dal server.',
            };
        }
    } catch (error) {
        console.error('Errore durante il login:', error);
        return {
            success: false
        };
    }
}
export async function registerUser(name, surname, username, email, password) {
    try {
        const response = await fetch('http://localhost:8000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, surname, username, email, password }),
        });

        const data = await response.json();

        if (response.ok) { //response.status(metto l'errore del backend)
            // Gestisce il caso di errore (e.g., 400 o 500)
            return {
                success: false,
                message: data.message || `Errore durante la registrazione (status: ${response.status})`,
            };
        }

        // Registrazione riuscita
        return {
            success: true,
            message: data.message || 'Registrazione riuscita!'
        };
    } catch (error) {
        console.error('Errore durante la registrazione:', error);
        return {
            success: false,
            message: 'Errore durante la connessione al server.'
        };
    }
}

export async function CreateActivity(name, topic, place, date, maxSlot) {
    if (!name || !topic || !place || !date || maxSlot <= 0) {
        console.error('Invalid input provided for activity creation.');
        return {
            success: false,
            message: 'Please provide valid inputs for all fields.',
        };
    }

    try {
        const response = await fetch('http://localhost:8000/api/v1/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
            },
            body: JSON.stringify({ name, topic, place, date, maxSlot }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Server responded with an error:', response.status, data);
            return {
                success: false,
                message: data.message || `Failed to create activity. (Status: ${response.status})`,
            };
        }

        return {
            success: true,
            message: 'Activity successfully created!',
        };
    } catch (error) {
        console.error('Error while creating activity:', error);
        return {
            success: false,
            message: 'An error occurred while connecting to the server.',
        };
    }
}
