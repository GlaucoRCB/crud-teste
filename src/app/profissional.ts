export interface Profissional {
    id:string;
    nome: string;
    especialidade: string;
    crm: string;
    contato: string;
    email: string;
    dataContrato: string | Date;
    inicioAtendimento: string;
    fimAtendimento: string;
    diasAtendimento: boolean[];
    status: string;
}