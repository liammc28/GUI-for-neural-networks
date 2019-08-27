import React from "react";
import {handleLogin} from "../src/js/Utils"

describe('Utils',()=>{

    beforeEach(()=>{
        localStorage.setItem("loggedIn", JSON.stringify(false));
    });

    it('setting login ', () => {
        handleLogin();
        expect( localStorage.getItem("loggedIn")).toBeTruthy();
    });
});
