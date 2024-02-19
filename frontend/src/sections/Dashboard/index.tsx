import { userStore } from "../../store/UserStore"
import { observer } from 'mobx-react';
import Layout from "../Layout";

export const Dashboard = observer(() => {

    const {user} = userStore;
    console.log("User ", user.name);


    return <Layout>Dashboard</Layout>
});