from flask import Blueprint, jsonify, session, request
from app.models import User, Portfolio, PortfolioValue, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from ..seeds.portfolio_values import seed_portfolio_values, undo_portfolios_values

auth_routes = Blueprint('auth', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    # if current_user.id == 1:
    #     # Reset balance of Demo User
    #     demo_user_portfolio = Portfolio.query.get(1)
    #     demo_user_portfolio.cash_balance = 10000
    #     demo_user_portfolio.initial_principle = 10000

    #     # Reset portfolio history
    #     user_2_portfolio = Portfolio.query.get(2)
    #     user_3_portfolio = Portfolio.query.get(3)

    #     demo_user_portfolio_values = demo_user_portfolio.portfolio_values
    #     user_2_portfolio_values = user_2_portfolio.portfolio_values
    #     user_3_portfolio_values = user_3_portfolio.portfolio_values

    #     for value in demo_user_portfolio_values:
    #         db.session.delete(value)

    #     for value in user_2_portfolio_values:
    #         db.session.delete(value)

    #     for value in user_3_portfolio_values:
    #         db.session.delete(value)

    #     db.session.commit()

    #     # Seed new portfolio values
    #     seed_portfolio_values()

    # Log the user out
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password']
        )

        db.session.add(user)
        db.session.commit()

        # Create user portfolio and first historical data point
        portfolio = Portfolio(
            user_id=user.id,
            cash_balance=10000,
            initial_principle=10000
        )

        db.session.add(portfolio)
        db.session.commit()

        portfolio_value = PortfolioValue(
            portfolio_id=portfolio.id,
            current_balance=portfolio.cash_balance
        )

        db.session.add(portfolio_value)
        db.session.commit()

        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401
