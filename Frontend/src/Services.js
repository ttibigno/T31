const base_api = "https://backend-aroundyou.onrender.com/api/v2";
export async function loginUser(username, password) {
    try {
        const response = await fetch(base_api + '/auth/login', {
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

        if (data.accessToken) {
            localStorage.setItem('authToken', data.accessToken);
            console.log('Token salvato in localStorage:', data.accessToken);
            localStorage.setItem('role', data.isAdmin);
            return { success: true };
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
        const response = await fetch(base_api +'/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, surname, username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            return {
                success: false,
                message: data.message || `Errore durante la registrazione (status: ${response.status})`,
            };
        }
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

export async function CreateActivity(name, topics, place, date, maxSlot) {
    if (!name || !topics || !place || !date || maxSlot <= 0) {
        console.error('Invalid input provided for activity creation.');
        return {
            success: false,
            message: 'Insersci valori in tutti i campi',
        };
    }

    try {
        const response = await fetch(base_api + '/users/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
            },
            body: JSON.stringify({ name, topics, place, date, maxSlot }),
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
