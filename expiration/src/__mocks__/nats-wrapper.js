"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.natsWrapper = void 0;
exports.natsWrapper = {
    client: {
        publish: jest
            .fn().mockImplementation((subject, data, callback) => {
            callback();
        })
    }
    // client:{
    //     publish: (subject: string, data: string, callback: () => void ) => {
    //         callback()
    //     }
    // }
};
