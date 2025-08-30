from webapp_hamburg_vs_hotdog.blueprints.voting.models import Contestant

def get_contestant_stats(contestant: Contestant):
    """Return a dict of contestant stats for API or JS use."""
    total_votes = len(contestant.votes)
    wins = 0
    losses = 0

    for matchup in contestant.all_matchups:
        votes_a = sum(1 for v in matchup.votes if v.contestant_id == matchup.contestant_a_id)
        votes_b = sum(1 for v in matchup.votes if v.contestant_id == matchup.contestant_b_id)
        if votes_a > votes_b:
            winner_id = matchup.contestant_a_id
        elif votes_b > votes_a:
            winner_id = matchup.contestant_b_id
        else:
            winner_id = None  # Tie

        if winner_id == contestant.id:
            wins += 1
        elif winner_id is not None:
            losses += 1

    return {
        'contestant_id': contestant.id,
        'contestant_name': contestant.contestant_name,
        'total_votes': total_votes,
        'wins': wins,
        'losses': losses,
    }