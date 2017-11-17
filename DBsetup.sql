-- For Voice Synthesizer --
CREATE TABLE "responses" (
    id SERIAL PRIMARY KEY,
    "response_id" varchar(100),
    "response_text" varchar(300)
);

INSERT INTO responses ("response_id", "response_text") VALUES
('no', 'No'), ('no_thanks', 'No, thank you'), ('yes', 'Yes'),
('yes_please', 'Yes, please'), ('laryngitis', 'I can''t talk. I have laryngitis.');
