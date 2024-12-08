import { Subjects } from "@demotickets/common";

export const natsWrapper = {
    client:{
        publish: jest
                .fn().mockImplementation((subject: string, data: string,callback: () => void) => {
                    callback()
                })
    }
    // client:{
    //     publish: (subject: string, data: string, callback: () => void ) => {
    //         callback()
    //     }
    // }
};