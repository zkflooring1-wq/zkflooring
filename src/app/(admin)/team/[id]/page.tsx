import TeamEditor from '../_components/TeamEditor';

export default function EditTeamMember({ params }: { params: { id: string } }) {
  return <TeamEditor id={params.id} />;
}
