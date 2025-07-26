
export const METHOD_POST = "POST";
export const userLocal = '@user'
export const logoutLocal = '@logout'
export const SERVICE_KEY = 'CgYh5TbHicce4HDZzk11At2Z2k1DuxkR'
export const base_url = "http://167.86.75.204:8024";
// export const LOCAL_URL = "https://soft.metuaa.com";

// prod params
export const LOCAL_URL = "https://soft.erp.sekoo.org";
export const API_KEY = "6P22JAW70HXFNCQTY11SQIR6BLKRA2MU";
export const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluQHNvZnRlZHVjYXQub3JnIiwidWlkIjoyfQ.SFASiMdz-ZJbIxS_-W1uJUtnylXcaqOsTBfYTObV2gY";

// dev params
// export const LOCAL_URL = "https://soft.metuaa.com";
// export const API_KEY = "L5KOIB9LVV49JIWUII1CQML82T4GZ41W";
// export const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluQHNvZnRlZHVjYXQub3JnIiwidWlkIjoyfQ.RtpA4L_vL8ATFGHrPO_lsXnmcOD43z7ehLT5XBgC1J8";

export const DATABASE = "openeducat_erp";

const headers = new Headers();

headers.append('api-key', API_KEY)
headers.append('token', TOKEN)


export async function postData(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", JSON.stringify(arg));
    return fetch(url, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(arg)
    }).then((res) => {
        console.log("mauvaise reponse", res);
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
        }
    })
}
export async function postDataSave(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", JSON.stringify(arg).toString());
    return fetch(url, {
        headers: headers,
        method: 'POST',
        body: '' + JSON.stringify(arg) + ''
    }).then((res) => {
        // console.log("mauvaise reponse", res);
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
        }
    })
}


export async function putDataMRedis(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", arg);

    return fetch(url, {
        headers: { 'Content-Type': 'application/json', },
        method: 'PUT',
        body: JSON.stringify(arg)
    }).then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
        }
    })
}
export async function AddAmount(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", arg);

    const formdata = new FormData();
    formdata.append("partner_id", arg?.partner_id);
    formdata.append("amount", arg?.amount);
    formdata.append("journal_id", arg?.selectJournals);
    return fetch(url, {
        headers: headers,
        method: 'POST',
        body: formdata
    }).then((res) => {
        // console.log("mauvaise reponse", res);
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
        }
    })
}
export async function RechargeMobileWalletEnd(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", arg);

    const formData = new FormData();
    for (const key in arg) {
        formData.append(key, arg[key]);
    }

    console.log(formData);
    return fetch(url, {
        headers: headers,
        method: 'POST',
        body: formData
    }).then((res) => {
        console.log("mauvaise reponse", res);
        if (res.ok) {
            return res.json()
        } else {
            throw new Error({ message: "une erreur s'est produite veillez", status: res.status, statusText: res.statusText });

            console.log("mauvaise reponse", res);
        }
    })
}
export async function PostFormData(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", arg);

    const formData = new FormData();
    for (const key in arg) {
        formData.append(key, arg[key]);
    }

    return fetch(url, {
        headers: headers,
        method: 'POST',
        body: formData
    }).then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
            throw new Error({ message: "une erreur s'est produite veillez", status: res.status, statusText: res.statusText });

            console.log("mauvaise reponse", res);
        }
    })
}
export async function MobileRechargeBalence(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", arg);

    const formdata = new FormData();
    formdata.append("service", SERVICE_KEY);
    formdata.append("amount", arg?.amount);
    formdata.append("phonenumber", arg?.phoneNumber);
    return fetch(url, {
        headers: headers,
        method: 'POST',
        body: formdata
    }).then((res) => {
        // console.log("mauvaise reponse", res);
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
        }
    })
}
export async function MobileVerifyBalence(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", arg);

    const formdata = new FormData();
    formdata.append("paymentId", arg?.paymentId);

    return fetch(url, {
        headers: headers,
        method: 'POST',
        body: formdata
    }).then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
        }
    })
}
export async function SentOtp(url, { arg }) {
    console.log("request URL", url);
    const formdata = new FormData();
    formdata.append("email", arg?.email);

    return fetch(url, {
        headers: headers,
        method: 'POST',
        body: formdata
    }).then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
        }
    })
}
export async function VerifyOtp(url) {
    console.log("request URL", url);
    return fetch(url, {
        headers: headers,
        method: 'GET',
    }).then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
        }
    })
}


export async function postMessageDoc(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", arg);
    const formdata = new FormData();
    const header = new Headers();
    header.append('Content-Type', "multipart/form-data")
    header.append('Accept', "application/json")
    header.append('api-key', API_KEY)
    header.append('token', TOKEN)

    formdata.append("user_id", arg?.user_id);
    formdata.append("message", arg?.message);
    if (arg?.file) formdata.append("file", arg?.file);



    console.log("request formdata", formdata);
    return fetch(url, {
        headers: header,
        method: 'POST',
        body: formdata
    }).then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
        }
    })
}
export async function postDataDoc(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", arg);
    const formdata = new FormData();
    const header = new Headers();
    header.append('Content-Type', "multipart/form-data")
    // 'Accept': 'application/json'
    header.append('Accept', "application/json")
    header.append('api-key', API_KEY)
    header.append('token', TOKEN)
    if (arg?.document) {

        formdata.append("document", arg?.document);
    }
    formdata.append("faculty_id", arg?.faculty_id);
    formdata.append("room_id", arg?.room_id);
    formdata.append("subject_id", arg?.subject_id);
    formdata.append("description", arg?.description);
    formdata.append("submission_date", getCorrectDateFormat(arg?.submission_date));
    formdata.append("assignment_type", arg?.assignment_type);
    formdata.append("name", arg?.name);


    console.log("request formdata", formdata, header);
    return fetch(url, {
        headers: header,
        method: 'POST',
        body: formdata
    }).then((res) => {
        // console.log("mauvaise reponse", res);
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
        }
    })
}

export function getCorrectDateFormat(chaine) {

    const date = new Date(chaine);

    const formattedDate = date.toISOString().replace('T', ' ').replace(/\.\d+Z/, '');
    return formattedDate;
}
export async function postDataVehicule(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", arg);
    const { images } = arg
    var image = {}
    const formdata = new FormData();
    if (images) {

        if (images.face) {
            console.log("images face---------", images.face);
            formdata.append("face", images.face);

        }
        if (images.dos) {
            formdata.append("dos", images.dos);
        }
        if (images.cote) {
            formdata.append("cote", images.cote);
        }
        if (images.interieur) {
            formdata.append("interieur", images.interieur);
        }
    }

    formdata.append("user_id", arg?.UserID?.toString());
    formdata.append("chassisNumber", arg?.chassisNumber?.toString() || "0");
    formdata.append("licensePlate", arg?.licensePlate?.toString() || "---");
    formdata.append("model_id", arg?.model || 0);

    formdata.append("bluetooth", arg?.bluetooth?.toString() || "false");
    formdata.append("comfort", arg?.comfort?.toString() || "VIP");
    formdata.append("fleet_class", arg?.mode?.toString() || "VIP");
    formdata.append("fleet_comfort", arg?.comfort?.toString() || "VIP");
    formdata.append("class_vehicle_id", arg?.mode?.toString());
    formdata.append("comfort_vehicle_id", arg?.comfort?.toString());
    formdata.append("gps", arg?.gps?.toString() || "false");
    // formdata.append("imatriculationDate", arg?.imatriculationDate?.toString() || "--");
    formdata.append("imei", arg?.imei?.toString() || "00000");
    formdata.append("passagerNumber", arg?.passagerNumber?.toString() || 5);
    formdata.append("seats", arg?.passagerNumber?.toString() || 4);
    formdata.append("dorNumber", arg?.dorNumber?.toString() || 2);
    formdata.append("color", arg?.color?.toString() || "Noire");
    formdata.append("modelYear", arg?.modelYear?.toString() || "0");
    formdata.append("description", arg?.description?.toString() || "-----");
    if (arg?.driver) {
        formdata.append("driver_id", arg?.driver);
    }
    formdata.append("rent", arg?.rent || "false");

    if (arg?.rentEndTime && arg?.rentStartTime && arg?.rent) {
        formdata.append("rent", arg?.rent);

        formdata.append("rentEndTime", getCorrectDateFormat(arg?.rentEndTime));
        formdata.append("rentStartTime", getCorrectDateFormat(arg?.rentStartTime));
    }

    // formdata.append("mode", arg?.mode?.toString() || "");
    formdata.append("mode", arg?.mode || "A");
    console.log("request formdata", formdata);
    return fetch(url, {
        headers: headers,
        method: 'POST',
        body: formdata
    }).then((res) => {
        console.log("mauvaise reponse", res);
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
        }
    })
}
export async function putData(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", arg);

    return fetch(url, {
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(arg)
    }).then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
        }
    })
}
export async function deleteData(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", arg);

    return fetch(url, {
        headers: headers,
        method: "DELETE",
    }).then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
            throw new Error("Erreur lors de l'execution de la requete status:" + res.status + "" + res.statusText);

        }
    })
}
export function putDataM(url, { arg }) {
    console.log("request URL", url);
    console.log("request arg", arg);

    return fetch(url, {
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(arg)
    }).then((res) => {
        if (res.ok) {
            return res.json()
        } else {
            console.log("mauvaise reponse", res);
            throw new Error("Erreur lors de l'execution de la requete status:" + res.status + "" + res.statusText);
        }
    })
}
export async function getData(url) {
    // console.log("request URL", url);


    return fetch(url, {
        headers: headers,
        method: 'GET',
    }).then((res) => {
        if (res.ok) {

            return res.json()
        } else {
            console.log("mauvaise reponse", res);
            throw new Error("Erreur lors de l'execution de la requete status:" + res.status + "" + res.statusText);

        }
    })
}
export const getDataM = (url) => {
    console.log("request URL", url);


    return fetch(url, {
        headers: headers,
        method: 'GET',
    }).then((res) => {
        if (res.ok) {

            return res.json()
        } else {
            console.log("mauvaise reponse", res);
            throw new Error("Erreur lors de l'execution de la requete status:" + res.status + "" + res.statusText);

        }
    })
}
