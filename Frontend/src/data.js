const pages = [
    {
        link: { text: "home", url: "index.html" },
        pageTitles: "Home Page",
        content: "This is the home page",
        published: true,
    },
    {
        link: { text: "about", url: "index.html" },
        pageTitles: "About Page",
        content: "This is the about page",
        published: true,
    },
    {
        link: { text: "contacts", url: "index.html" },
        pageTitles: "Contacts Page",
        content: "This is the contacts page",
        published: true,
    },
];

const pageKey = 'Pages';
localStorage.setItem(pageKey, JSON.stringify(pages));
let pagesJson = localStorage.getItem(pageKey);
let pagesStore = pagesJson ? JSON.parse(pagesJson) : []; // Predefinito: array vuoto

export default {
    getAllPages() {
        return pagesStore; // Restituisce un array vuoto se non ci sono pagine
    },

    getSinglePage(index) {
        if (!pagesStore || !Array.isArray(pagesStore)) {
            console.error('pagesStore non è un array o non è stato inizializzato correttamente.');
            return null; // Prevenire l'accesso a oggetti null o undefined
        }
        return pagesStore[index];
    },
};
