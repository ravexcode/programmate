//Reactions type
export type MsgReactions = {
  reacter: string;
  emoji: string;
};

//Message class
export class Message {
  public content: string;
  public sender: string;
  public reactions: Array<MsgReactions>;
  public sent_at: Date;
  public team_id?: string;
  public id?: string;

  constructor(
    content: string,
    sender: string,
    reactions: Array<MsgReactions> = [],
    sent_at: Date = new Date(),
    team_id?: string,
    id?: string
  ) {
    this.content = content;
    this.sender = sender;
    this.reactions = reactions;
    this.sent_at = sent_at;
    this.team_id = team_id;
    this.id = id;
  }
}

export default Message;