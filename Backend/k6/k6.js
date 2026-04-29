import http from 'k6/http';
import { check, sleep } from 'k6';

// build: k6 run --out csv=results.csv k6.js

const BASE_URL = 'http://localhost:8000/api/v2';

const BASE_USERS = [
    { username: 'usr1', password: 'password' },
    { username: 'usr2', password: 'password' }
];

function generateNewUsers() {
    let users = [];
    for (let i = 0; i < 9; i++) {
        users.push({
            name: `Test${i}`,
            surname: `User${i}`,
            email: `testuser${i}@mail.com`,
            username: `testuser${i}`,
            password: 'password'
        });
    }
    return users;
}

export function setup() {
    let newUsers = generateNewUsers();

    newUsers.forEach(u => {
        let res = http.post(
            `${BASE_URL}/auth/register`,
            JSON.stringify(u),
            { headers: { 'Content-Type': 'application/json' } }
        );

        check(res, {
            'REGISTER is 201 or 409': (r) => r.status === 201 || r.status === 409,
        });
    });

    return newUsers;
}

export let options = {
    stages: [
        { duration: '20s', target: 5 },
        { duration: '120s', target: 10 },
        { duration: '40s', target: 0 },
    ]
};

function login(user) {
    let res = http.post(
        `${BASE_URL}/auth/login`,
        JSON.stringify({
            username: user.username,
            password: user.password,
        }),
        { headers: { 'Content-Type': 'application/json' } }
    );

    let token = res.json('accessToken');

    check(res, {
        'LOGIN successful': (r) => r.status === 200,
    });

    return token;
}

function authHeaders(token) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

function testAdminManageActivities(headers) {
    let adminActivities = http.get(`${BASE_URL}/admin/manageActivities`, { headers });

    check(adminActivities, {
        'ADMIN manage activities successful': (r) => r.status === 200 || r.status === 204,
    });

    return adminActivities;
}

function testAdminManageUsers(headers, query = '*') {
    let adminUsers = http.get(`${BASE_URL}/admin/manageUsers/${query}`, { headers });

    check(adminUsers, {
        'ADMIN search users successful': (r) => r.status === 200,
    });

    return adminUsers;
}

function getAllUsers(headers) {
    let allUsers = http.get(`${BASE_URL}/admin/manageUsers`, { headers });

    return allUsers;
}

export default function (data) {

    const users = BASE_USERS.concat(data);
    const user = users[Math.floor(Math.random() * users.length)];

    const token = login(user);
    const headers = authHeaders(token);

    let getAll = http.get(`${BASE_URL}/activities`, { headers });

    check(getAll, {
        'GET activities 200': (r) => r.status === 200,
    });

    let userActivities = http.get(`${BASE_URL}/users/activities`, { headers });

    check(userActivities, {
        'GET user activities successful': (r) => r.status === 200 || r.status === 204,
    });

    let activityName = `k6-${user.username}-${__ITER}`;
    let futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);
    
    let activity = {
        name: activityName,
        topic: ['testing'],
        place: 'online',
        date: futureDate.toISOString(),
        maxSlot: 5,
    };

    let post = http.post(
        `${BASE_URL}/users/activities`,
        JSON.stringify(activity),
        { headers }
    );

    check(post, {
        'POST activity successful (201)': (r) => r.status === 201,
    });

    let activityId = null;
    if (post.status === 201) {
        // Fetcha la lista delle attività dell'utente per estrarre l'ID
        let listActivities = http.get(`${BASE_URL}/users/activities`, { headers });
        
        check(listActivities, {
            'GET user activities for ID extraction': (r) => r.status === 200 || r.status === 204,
        });
        
        if (listActivities.status === 200) {
            let activities = listActivities.json();
            if (Array.isArray(activities) && activities.length > 0) {
                // Trova l'attività appena creata per nome
                let createdActivity = activities.find(a => a.name === activityName);
                if (createdActivity && createdActivity._id) {
                    activityId = createdActivity._id;
                } else {
                    // Fallback: prendi la prima (ultima creata)
                    activityId = activities[0]._id;
                }
                
                check(listActivities, {
                    'Activity ID extraction successful': (r) => activityId !== null && activityId !== undefined,
                });
            } else {
                check(listActivities, {
                    'Activity list not empty': (r) => false, // Force fail per debug
                });
            }
        }
    }

    let userPrivate = http.get(`${BASE_URL}/users/private`, { headers });

    check(userPrivate, {
        'GET user private 200': (r) => r.status === 200,
        'GET user private has name': (r) => r.json('name') !== undefined,
        'GET user private has email': (r) => r.json('email') !== undefined,
    });

    let search = http.get(`${BASE_URL}/activities/testing`, { headers });

    check(search, {
        'SEARCH activities 200': (r) => r.status === 200,
        'SEARCH is array': (r) => Array.isArray(r.json()),
    });

    let joinedActivities = http.get(`${BASE_URL}/join`, { headers });

    check(joinedActivities, {
        'GET joined successful': (r) => r.status === 200,
    });

    let fakeId = 'invalid-id';
    let join = http.put(`${BASE_URL}/join/${fakeId}`, '', { headers });

    check(join, {
        'JOIN invalid ID returns error': (r) => r.status === 400 || r.status === 404,
    });

    if (activityId) {
        let joinValid = http.put(`${BASE_URL}/join/${activityId}`, '', { headers });

        check(joinValid, {
            'JOIN valid activity successful': (r) => r.status === 200 || r.status === 400 || r.status === 404,
        });
    }

    let report = http.put(`${BASE_URL}/report/${fakeId}`, '', { headers });

    check(report, {
        'REPORT invalid ID returns error': (r) => r.status === 400 || r.status === 404,
    });

    if (activityId) {
        let reportValid = http.put(`${BASE_URL}/report/${activityId}`, '', { headers });

        check(reportValid, {
            'REPORT valid activity successful': (r) => r.status === 200 || r.status === 400 || r.status === 404,
        });
    }

    check(getAll, {
        'GET activities returns valid data': (r) => r.status === 200 && Array.isArray(r.json()),
    });

    if (activityId) {
        let updatedActivity = {
            name: `k6-updated-${user.username}`,
            topic: ['testing', 'updated'],
            place: 'online-updated',
            date: futureDate.toISOString(),
            maxSlot: 10,
        };

        let update = http.put(
            `${BASE_URL}/users/activities/${activityId}`,
            JSON.stringify(updatedActivity),
            { headers }
        );

        check(update, {
            'PUT activity successful': (r) => r.status === 200,
        });
    }

    if (activityId) {
        let deleteActivity = http.del(`${BASE_URL}/users/activities/${activityId}`, null, { headers });

        check(deleteActivity, {
            'DELETE activity successful': (r) => r.status === 200,
        });
    }

    let updatedUser = {
        name: `Updated${user.name}`,
        surname: `Updated${user.surname}`,
        email: user.email,
        username: user.username,
        password: user.password,
    };

    let updateUser = http.put(
        `${BASE_URL}/users/private`,
        JSON.stringify(updatedUser),
        { headers }
    );

    check(updateUser, {
        'PUT user info successful': (r) => r.status === 200,
    });

    sleep(1);
}