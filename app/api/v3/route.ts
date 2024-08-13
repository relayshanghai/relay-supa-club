class Router {
    async GET() {
        return Response.json({ message: 'GET' });
    }
}
const r = new Router
export default r;
