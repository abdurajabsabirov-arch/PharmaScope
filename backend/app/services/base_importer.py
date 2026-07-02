from sqlalchemy.orm import Session


class BaseImporter:

    def __init__(self, db: Session):
        self.db = db

    def save(self, model):

        self.db.add(model)

    def commit(self):

        self.db.commit()

    def rollback(self):

        self.db.rollback()