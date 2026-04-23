import { isAuthenticated } from "@/lib/authGuard";
import { addToYourContacts } from "../../../../services/contact.services";


export async function POST(request: Request) {
    try {
        const userId = await isAuthenticated();
        if (!userId) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { contactId } = await request.json();
        if (!contactId) {
            return Response.json(
                { message: "Contact ID is required" },
                { status: 400 }
            );
        }
    
        const contacts = await addToYourContacts(userId, contactId);

        console.log(contacts);          

        return Response.json({ contacts }, { status: 200 });
    } catch (error: any) {
        return Response.json(
            { message: "Failed to fetch contacts" },
            { status: 500 }
        );
    }
}  


