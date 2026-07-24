import { getCurrentUser } from "aws-amplify/auth";
import { configureAmplify } from "./amplify";

type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;

let user = $state<CurrentUser | null>(null);
let isLoading = $state(true);

const refresh = async () => {
	isLoading = true;

	try {
		configureAmplify();

		user = await getCurrentUser();
	} catch {
		user = null;
	} finally {
		isLoading = false;
	}
};

export const auth = {
	get user() {
		return user;
	},

	get isAuthenticated() {
		return user !== null;
	},

	get isLoading() {
		return isLoading;
	},

	refresh
};
