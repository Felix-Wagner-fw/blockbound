import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from '../Pages/Auth';
import { user, db } from '../API/user';
import '../assets/css/global.css';

import Landlord from '../Pages/Landlord';
import Dashboard from '../Pages/Tenant';
import Invite from '../Pages/Auth/invite';
import SelectWallet from '../Pages/Components/selectWallet';

interface RouterState {
loading: boolean;
publicKey: string;
email: string;
profile: any;
wallet: any;
}

class Router extends Component<{}, RouterState> {
constructor(props: {}) {
super(props);

this.state = {
    loading: true,
    publicKey: '',
    email: '',
    profile: {},
    wallet: {}
};
}
componentDidMount() {
db.on('auth', async (ack: any) => {
    console.log('Authentication was successful: ', ack);
    var pub = user._.sea.pub;
    var who = await user.get('alias').then();
    var profile = await user.get('profile').then();
    var wallet = await user.get('wallet').then();
    if (!wallet) {
        wallet = {};
    }
    this.setState({ publicKey: pub, email: who, profile: profile, wallet: wallet, loading: false });
});
}

render() {
const { publicKey, wallet, profile, email, loading } = this.state;
return (
    <BrowserRouter>
        {user.is ? (
            <Routes>
                <Route
                    path="/Invite"
                    element={<Invite authenticated={true} profile={profile} email={email} />}
                />
                <Route
                    path="/"
                    element={
                        (!loading && !wallet.type) || wallet.type === '' ? (
                            <SelectWallet
                                profile={profile}
                                email={email}
                                wallet={wallet}
                                publicKey={publicKey}
                            />
                        ) : !loading ? profile.role === 'landlord' ? (
                            <Landlord profile={profile} email={email} wallet={wallet} publicKey={publicKey} />
                        ) : (
                            <Dashboard profile={profile} email={email} wallet={wallet} publicKey={publicKey} />
                        ) : (
                            <div className="page">
                                <h1>LOADING</h1>
                            </div>
                        )
                    }
                />
            </Routes>
        ) : (
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/Invite" element={<Invite authenticated={false} />} />
            </Routes>
        )}
    </BrowserRouter>
);
}

}

export default Router;