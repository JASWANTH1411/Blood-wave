// 🩸 Blood Wave Script.js

let map;
let markers = [];

//////////////////////////////////////////////////////////
// 🗺️ INITIALIZE GOOGLE MAP
//////////////////////////////////////////////////////////

function initMap() {

    // 📍 Default location
    const defaultLocation = {

        lat: 17.3850,
        lng: 78.4867

    };

    // 🗺️ Create Map
    map = new google.maps.Map(

        document.getElementById("map"),

        {

            center: defaultLocation,
            zoom: 10

        }

    );

}

//////////////////////////////////////////////////////////
// 🧾 REGISTER USER / DONOR
//////////////////////////////////////////////////////////

async function registerUser(event) {

    event.preventDefault();

    // 👤 Get values
    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const role =
        document.getElementById("role").value;

    const blood =
        document.getElementById("blood").value;

    const city =
        document.getElementById("city")
        .value
        .toUpperCase();

    const pincode =
        document.getElementById("pincode").value;

    // 📦 Data object
    const data = {

        name,
        email,
        password,
        role,
        blood,
        city,
        pincode

    };

    try {

        // 🚀 Send data to backend
        const res = await fetch(

            "http://localhost:3000/register",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify(data)

            }

        );

        // 📥 Get response
        const result =
            await res.json();

        // ✅ Show message
        alert(result.message);

        // 🧹 Clear form
        document
            .getElementById("registerForm")
            .reset();

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}

//////////////////////////////////////////////////////////
// 🔍 LOAD DONORS
//////////////////////////////////////////////////////////

async function loadDonors() {

    // 🩸 Blood group
    const blood =
        document.getElementById("bloodGroup")
        .value;

    // 🏙️ City
    const city =
        document.getElementById("city")
        .value
        .toUpperCase();

    // 📮 Pincode
    const pincode =
        document.getElementById("pincode")
        .value;

    try {

        //////////////////////////////////////////////////
        // 🚀 FETCH DONORS
        //////////////////////////////////////////////////

        const res = await fetch(

`http://localhost:3000/donors?blood=${blood}&city=${city}&pincode=${pincode}`

        );

        //////////////////////////////////////////////////
        // 📥 JSON RESPONSE
        //////////////////////////////////////////////////

        const donors =
            await res.json();

        console.log(donors);

        //////////////////////////////////////////////////
        // ❌ NO DONORS
        //////////////////////////////////////////////////

        if (donors.length === 0) {

            alert("No donors found");

            document.getElementById(
                "donorList"
            ).innerHTML = "";

            return;

        }

        //////////////////////////////////////////////////
        // ✅ SHOW DONORS
        //////////////////////////////////////////////////

        showDonors(donors);

    }

    catch (error) {

        console.log(error);

        alert("Error fetching donors");

    }

}

//////////////////////////////////////////////////////////
// 📋 SHOW DONORS
//////////////////////////////////////////////////////////

function showDonors(donors) {

    // 📦 Donor list container
    const donorList =
        document.getElementById("donorList");

    // 🧹 Clear old donors
    donorList.innerHTML = "";

    // 🗑️ Remove old markers
    markers.forEach(marker => {

        marker.setMap(null);

    });

    markers = [];

    //////////////////////////////////////////////////////
    // 🔁 LOOP DONORS
    //////////////////////////////////////////////////////

    donors.forEach(donor => {

        //////////////////////////////////////////////////
        // 🗺️ CREATE MAP MARKER
        //////////////////////////////////////////////////

        const marker =
            new google.maps.Marker({

                position: {

                    lat: 17.3850,
                    lng: 78.4867

                },

                map: map,

                title:
                    `${donor.name} (${donor.blood})`

            });

        markers.push(marker);

        //////////////////////////////////////////////////
        // 📄 CREATE DONOR CARD
        //////////////////////////////////////////////////

        const div =
            document.createElement("div");

        div.classList.add("donor-card");

        div.innerHTML = `

            <h3>${donor.name}</h3>

            <p>
                Blood Group:
                ${donor.blood}
            </p>

            <p>
                City:
                ${donor.city}
            </p>

            <p>
                Pincode:
                ${donor.pincode}
            </p>

            <p>
                Role:
                ${donor.role}
            </p>

            <p>
                Email:
                ${donor.email}
            </p>

        `;

        // ➕ Add donor card
        donorList.appendChild(div);

    });

}

//////////////////////////////////////////////////////////
// 🔐 LOGIN USER
//////////////////////////////////////////////////////////

async function loginUser(event) {

    event.preventDefault();

    // 📧 Email
    const email =
        document.getElementById("email").value;

    // 🔐 Password
    const password =
        document.getElementById("password").value;

    // 📦 Data
    const data = {

        email,
        password

    };

    try {

        //////////////////////////////////////////////////
        // 🚀 LOGIN REQUEST
        //////////////////////////////////////////////////

        const res = await fetch(

            "http://localhost:3000/login",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify(data)

            }

        );

        //////////////////////////////////////////////////
        // 📥 RESPONSE
        //////////////////////////////////////////////////

        const result =
            await res.json();

        alert(result.message);

        //////////////////////////////////////////////////
        // ✅ LOGIN SUCCESS
        //////////////////////////////////////////////////

        if (result.token) {

            localStorage.setItem(

                "token",
                result.token

            );

            window.location.href =
                "finddonor.html";

        }

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}

//////////////////////////////////////////////////////////
// 📧 FORGOT PASSWORD
//////////////////////////////////////////////////////////

async function forgotPassword(event) {

    event.preventDefault();

    const email =
        document.getElementById("forgotEmail")
        .value;

    try {

        const res = await fetch(

            "http://localhost:3000/forgot-password",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    email

                })

            }

        );

        const result =
            await res.json();

        alert(result.message);

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}

//////////////////////////////////////////////////////////
// 🔑 RESET PASSWORD
//////////////////////////////////////////////////////////

async function resetPassword(event) {

    event.preventDefault();

    // 🔗 Get token
    const params =
        new URLSearchParams(
            window.location.search
        );

    const token =
        params.get("token");

    // 🔐 New password
    const password =
        document.getElementById("newPassword")
        .value;

    try {

        const res = await fetch(

            "http://localhost:3000/reset-password",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    token,
                    password

                })

            }

        );

        const result =
            await res.json();

        alert(result.message);

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}