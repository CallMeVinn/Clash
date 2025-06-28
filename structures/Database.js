const { QuickDB } = require("dreamvast.quick.db");
const { PostgresDriver } = require("dreamvast.quick.db/PostgresDriver");

const postgresDriver = new PostgresDriver({
    user: process.env.PgUser || "",
    password: process.env.PgPassword || "",
    host: process.env.PgHost || "",
    port: 24014,
    database: "dev",
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUGv9lW3v42M1PSY/I9zZXaLSIOvgwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1N2IxOGVjMDYtNTQ3Ny00ZTZiLWExYjMtYTM4MTFjNzdk
NTU4IEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwNjI4MTMyMjI5WhcNMzUwNjI2MTMy
MjI5WjBAMT4wPAYDVQQDDDU3YjE4ZWMwNi01NDc3LTRlNmItYTFiMy1hMzgxMWM3
N2Q1NTggR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBAOyn0Xu5hnhCYYUoHhyJpJUGIQ1ctSPGJtVnL7vBq9LoOSQ1JV+w8E1L
Jxa0fXJTHkPTOGruroK6XeLFV6YHfyRgWXQcTogtPs/e17MAqhTsQJJ9OnIyT6jd
zUPLy2SvFXgzlaIrcF6lJKsje09yZNL6ib6+ad/uPMuOsEtnylLUGcVX11I7F6xQ
2CEOiSVwzO/u2NqdIRlaHk9kOqxCRp7LOY+0qraRI99hmKXWmRNoMBXrGtJi9PyU
wVS/qJRPiwST0yg3LVZPTa/0XmAciJRH8FRr22zlZv/TFgE2wB/FwoceHyAQAOca
tBAJv+/PQAksX4/nYJHI88RmI2b/pAAuQ/7omT2jjQAFj2edyGcA0OmymoTP76SG
QctMe32HkfOrpzJsmaWCuTo0+WIHrztJ4+1MMWT3SmORTbPPO8WT2mj9TpVXafQL
nx0Xzjhg3+ZjwvUlzeg8Bpbrx/t+sADUSrSt01TqZcwDpfIzJSgjuCtQJy/yQR5p
oOFXxZ3l2QIDAQABo0IwQDAdBgNVHQ4EFgQUWeZMO74BKsLyNghtPSfujfbFbaYw
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBANEqWzo9EPPZoBuFxp/Y2ceSxwOMe5tnSmUWgdlYJ1XQ4xMQoWOF3xcWVM19
uVGwlvaBT+9vUT1k04EXXMx46LYPgWFRg3oyNHsayAX+TYQuXce1KdjL81+IKOGf
CwBcLvZgN5UhyqCmKbXubCND9tLhfXYv83HR9QckFx2f2v7nwvEgMtG+P6VWs3N+
REpbsHQocFW54zm7geWPpr+9y1qmFP/c4n5zkjFBgNXUEQJxhWUG8zi7TZa5O4ca
iRsTQKi+gHn+aQ28OXMYDrMwSUGAwutofYtBExZxiHYanoVysHf7WD1Odbds3uEC
ZntMw3SGBZI4zbC84mSVb4Am9nOEYfQhGhbwjipi/p/rtYO2uHu4IXpilQTB/T8i
Ppub8kcmf6n76ACRecL3DSElAae8jHD1u7kAfxyXGgUzxSMJP6Fim/BnXw5CyFkd
cjDWw56qu+dEsUmHj90jLi6SH8jmsHux4c+Bm142RH7Ad0lwB7SItMWnUp4F86B2
0d88yQ==
-----END CERTIFICATE-----`,
    },
});

class Database extends QuickDB {
    constructor(client) {
        super({ driver: postgresDriver });
        
        postgresDriver.connect()
            .then(async() => {
                const ping = await this.ping();
                console.log("[Database:PostgreSQL] Connected. ✅", `Read: ${ping?.readLatency}ms | Write: ${ping?.writeLatency}ms | Delete: ${ping?.deleteLatency}ms`)
            })
            .catch(error => console.log("[Database:PostgreSQL] Can't connect!", error));
    }
    async ping() {
        let readLatency = -1;
        let writeLatency = -1;
        let deleteLatency = -1;
        
        const readLatencyStart = await Date.now();
        
        await this.all();
        readLatency = Date.now() - readLatencyStart;
        
        const writeLatencyStart = await Date.now();
        
        await this.set("WriteTest", { type: "test", message: "This Work?" });
        writeLatency = Date.now() - writeLatencyStart;
        
        const deleteLatencyStart = await Date.now();
            
        await this.delete("WriteTest");
        deleteLatency = Date.now() - deleteLatencyStart;
            
        return { readLatency, writeLatency, deleteLatency, };
    }
}

module.exports = Database;