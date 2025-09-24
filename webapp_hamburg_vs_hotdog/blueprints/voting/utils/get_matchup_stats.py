
from webapp_hamburg_vs_hotdog.blueprints.voting.models import Matchup
from webapp_hamburg_vs_hotdog.blueprints.comment.models import Comment
from webapp_hamburg_vs_hotdog.blueprints.comment.utils.commentor_name_gen import build_session_ids_coolname, build_comment_time_ago

def get_matchup_stats(matchup_id, session_id=None, message=None):
    """Return a dict of matchup stats for API or JS use."""
    votes_a = sum(1 for v in matchup_id.votes if v.contestant_id == matchup_id.contestant_a_id)
    votes_b = sum(1 for v in matchup_id.votes if v.contestant_id == matchup_id.contestant_b_id)
    total_votes = len(matchup_id.votes)
    percent_a = (votes_a / total_votes * 100) if total_votes > 0 else 50
    percent_b = (votes_b / total_votes * 100) if total_votes > 0 else 50

    session_id_matchup_vote_is = None
    if session_id:
        for vote in matchup_id.votes:
            if vote.session_id == session_id:
                session_id_matchup_vote_is = vote.contestant_id
                break

    # Query all comments related to matchup.id
    comments_query = Comment.query.filter_by(matchup_id=matchup_id.id).order_by(Comment.timestamp.desc()).all()
    comments = [
        {
            'session_id': c.session_id,
            "coolname": build_session_ids_coolname(c.session_id),
            "time_ago": build_comment_time_ago(c.timestamp),
            'text': c.text,
            'timestamp': c.timestamp.isoformat() if hasattr(c.timestamp, 'isoformat') else str(c.timestamp)
        }
        for c in comments_query
    ]

    return {
        'matchup_id': matchup_id.id,
        'total_votes': total_votes,
        'votes_a': votes_a,
        'votes_b': votes_b,
        'percent_a': percent_a,
        'percent_b': percent_b,
        'contestant_a_name': matchup_id.contestant_a.contestant_name,
        'contestant_b_name': matchup_id.contestant_b.contestant_name,
        'session_id_matchup_vote_is': session_id_matchup_vote_is,
        'message': message,
        'matchup_comments': comments,
    }


