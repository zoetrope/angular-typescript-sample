module app.models {
    export class Item {

        constructor(public content: string) {
            this.createdAt = new Date;
        }

        createdAt: Date;
    }
}