import csv
import os
import psycopg2
from dotenv import load_dotenv

def migrate_members():
    # Load environment variables from .env.local
    load_dotenv('.env.local')
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("DATABASE_URL not found in .env.local")
        return

    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        with open('kghs-89f golf data.csv', mode='r', encoding='utf-8') as f:
            reader = list(csv.reader(f))
            
            # Row 0: Empty, Empty, Name, 강정석, ...
            # Row 2: count, Date, CC/HD, 94.3, ... (Handicaps)
            names = reader[0][3:]
            handicaps = reader[2][3:]
            
            inserted_count = 0
            for i in range(len(names)):
                name = names[i].strip()
                if not name: continue
                
                try:
                    # Parse handicap
                    hd_str = handicaps[i].strip() if i < len(handicaps) else '0'
                    hd = float(hd_str) if hd_str else 0.0
                except ValueError:
                    hd = 0.0
                    
                cur.execute(
                    "INSERT INTO members (name, handicap, role) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING",
                    (name, hd, 'member')
                )
                inserted_count += 1
                
        conn.commit()
        print(f"Successfully migrated {inserted_count} members.")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    migrate_members()
