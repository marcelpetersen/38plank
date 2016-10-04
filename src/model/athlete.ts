export class Athlete {
  public $key: string;
  public name: string;
  public email: string;
  public team: string;
  public records: any;
  public units: string;
  public weight: number;
  public program: string;

  constructor(obj?: any) {
    this.$key = obj && obj.$key || '';
    this.name = obj && obj.name || '';
    this.email = obj && obj.email || '';
    this.team = obj && obj.team || '';
    this.records = obj && obj.records || [];
    this.units = obj && obj.units || 'imp';
    this.weight = obj && obj.units || 150;
    this.program = obj && obj.program || '';
  }
}
