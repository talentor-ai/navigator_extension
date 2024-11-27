import { ISession } from "@popup/models/model.session";

// Default values for the session
export const sessionInitialState: ISession = {
   id: "",
   username: "",
   fullName: "",
   email: "",
   password: "",
   token: "",
}