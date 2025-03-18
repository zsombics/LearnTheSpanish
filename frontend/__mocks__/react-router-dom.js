module.exports = {
    BrowserRouter: ({ children }) => children,
    Route: ({ children }) => children,
    Routes: ({ children }) => children,
    Link: ({ children }) => children,
    useNavigate: () => jest.fn(),
};
