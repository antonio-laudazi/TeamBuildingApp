// tslint:disable-next-line:no-namespace
export namespace Modello {
    export class Gruppo {
        public nome: string;
        public id: number;
        public tappe: Array<string>;
    }

    export class Tappa {
        public codice: string;
        public nome: string;
        public testo: string;
        public immagine: string;
        public coordinatex: number;
        public coordinatey: number;
        public domanda: Domanda;
        public abilitata: number;
        public completata: number;
    }

    export class Domanda {
        public testo: string;
        public risposte: Array<Risposta>;
        public rispostavalida: number;
        public parolaassociata: string;
    }

    export class Risposta {
        public testo: string;
        public codice: number;
    }

    export class DomandaTemporizzata {
        public testo: string;
        public codice: number;
        public punteggio: number;
        public risposte: Array<RispostaTemporizzata>;
        public codicerisposta: number;
    }

    export class RispostaTemporizzata {
        public testo: string;
        public codice: number;
    }
}
