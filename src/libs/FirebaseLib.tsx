import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { get, getDatabase, onValue, ref, remove, set, update } from "firebase/database";
import { getAppStage } from "../app/AppUtils";
import { FbDbPicklist } from "../model/picklist/picklist.Model";

const DEV_CONFIG = {
	apiKey: process.env.REACT_APP_FIREBASE_DEV_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_DEV_AUTH_DOMAIN,
	databaseURL: "https://alliance-selector-beta-default-rtdb.firebaseio.com",
	projectId: "alliance-selector-beta",
	storageBucket: "alliance-selector-beta.appspot.com",
	messagingSenderId: "397781631571",
	appId: "1:397781631571:web:76cea58abcc50dec91bca6",
};

const PROD_CONFIG = {
	apiKey: process.env.REACT_APP_FIREBASE_PROD_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_PROD_AUTH_DOMAIN,
	databaseURL: "https://alliance-selector-d9518-default-rtdb.firebaseio.com",
	projectId: "alliance-selector-d9518",
	storageBucket: "alliance-selector-d9518.appspot.com",
	messagingSenderId: "255656016827",
	appId: "1:255656016827:web:0fdb8d06d491667c87a29e",
};

const app = initializeApp(getAppStage() === "prod" ? PROD_CONFIG : DEV_CONFIG);
const fbDb = getDatabase(app);

export const fbAuth = getAuth(app);

export const readFbDb = async (path: string) => {
	const dbRef = ref(fbDb, path);
	const snapshot = await get(dbRef);
	if (snapshot.exists()) {
		const data = snapshot.val();
		return data;
	} else {
		return undefined;
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const writeFbDb = async (path: string, data: any) => {
	const dbRef = ref(fbDb, path);
	await set(dbRef, data);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateFbDb = async (path: string, data: any) => {
	const dbRef = ref(fbDb, path);
	await update(dbRef, data);
};

export const subscribeToFbDbPicklist = (
	pickListId: string,
	setData: (
		loadingPicklistId: string,
		picklist: FbDbPicklist | undefined,
		userId: string | undefined,
	) => void,
	userId: string | undefined,
): (() => void) | undefined => {
	const unsubscribe = onValue(ref(fbDb, `/picklists/${pickListId}`), (snapshot) => {
		if (snapshot.exists()) {
			setData(pickListId, snapshot.val(), userId);
		} else {
			setData(pickListId, undefined, userId);
		}
	});

	return unsubscribe;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeFbDb = async (path: string) => {
	const dbRef = ref(fbDb, path);
	await remove(dbRef);
};
