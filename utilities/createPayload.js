createPayload = (payload) => {
    let new_payload = {};
    for(let [key, value] of Object.entries(payload)) {
        if(value) new_payload[key] = value;
    }
    return new_payload;
}

module.exports = createPayload;