import { Collection } from 'mongodb';
import { getDb } from '../infra/mongodb';

type PaymentRecord = {
  _id?: any;
  id?: string;
  preference_id?: string;
  external_reference?: string;
  amount?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  raw?: any;
  [k: string]: any;
};

export default class PaymentsRepositoryMongo {
  private collection(): Collection<PaymentRecord> {
    return getDb().collection('payments');
  }

  async save(record: PaymentRecord) {
    const col = this.collection();
    const now = new Date().toISOString();
    record.created_at = record.created_at || now;
    const r = await col.insertOne(record);
    record._id = r.insertedId;
    return record;
  }

  async update(record: PaymentRecord) {
    const col = this.collection();
    const filter = {
      $or: [
        { preference_id: record.preference_id },
        { external_reference: record.external_reference },
        { id: record.id },
      ],
    };
    record.updated_at = new Date().toISOString();
    const { value } = await col.findOneAndUpdate(filter, { $set: record }, { upsert: true, returnDocument: 'after' as any });
    return value;
  }

  async findAll() {
    const col = this.collection();
    return col.find().sort({ created_at: -1 }).toArray();
  }

  async findByExternalReference(external_reference?: string) {
    if (!external_reference) return null;
    const col = this.collection();
    return col.findOne({ external_reference });
  }
}
