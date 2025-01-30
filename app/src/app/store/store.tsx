import { createContext, useContext } from "react";
import CommonStore from "./common/commonStore";
import FilmStore from "./film/filmStore";
import FilmFormStore from "./film/form/filmFormStore";
import PlayerStore from "./player/playerStore";
import UserStore from "./user/userStore";
import ProfileStore from "./profile/profileStore";

export default interface Store {
    filmStore: FilmStore,
    userStore: UserStore,
    commonStore: CommonStore,
    playerStore: PlayerStore,
    profileStore: ProfileStore,
    filmFormStore: FilmFormStore,
}

export const store: Store = {
    filmStore: new FilmStore(),
    userStore: new UserStore(),
    commonStore: new CommonStore(),
    playerStore: new PlayerStore(),
    profileStore: new ProfileStore(),
    filmFormStore: new FilmFormStore(),
}

export const StoreContext = createContext(store)

export function useStore() { return useContext(StoreContext); }