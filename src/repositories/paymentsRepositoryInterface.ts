export default interface PaymentsRepository {
  save(record: any): Promise<any>;
  update(record: any): Promise<any>;
  findAll(): Promise<any[]>;
  findByExternalReference(external_reference?: string): Promise<any | null>;
}
