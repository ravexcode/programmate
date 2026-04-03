class Team {
  public name : string;
  public description : string;
  public users_id : Array<Number>;
  public chat : Array<Object> | undefined;
  public kanban_board : Array<Object> | undefined;
  public callendar : Array<Object> | undefined;
  public created_at : Date;

  constructor(
    name: string,
    description: string,
    users_id: Array<Number>,
    created_at: Date,
  ) {
    this.name = name;
    this.description = description;
    this.users_id = users_id;
    this.created_at = created_at;
  }
}

export default Team;