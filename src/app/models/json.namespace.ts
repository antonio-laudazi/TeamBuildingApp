import { Modello } from './gruppo.namespace';

export class JsonResponse {
    public gruppi: Array<Modello.Gruppo>;
    public domandetemporizzate: Array<Modello.DomandaTemporizzata>;
    public tappe: Array<Modello.Tappa>;
}
