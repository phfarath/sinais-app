import cv2, dlib, numpy as np, pickle, os, time
 
PREDICTOR = "shape_predictor_5_face_landmarks.dat"
RECOG = "dlib_face_recognition_resnet_model_v1.dat"
DB_FILE = "db.pkl"
THRESH = 0.6
 
# ADIÇÃO: arquivo separado para perfis de investidor
PROF_FILE = "profiles.pkl"
 
# ADIÇÃO: mapa de mensagens por tipo de investidor (para exibir no reconhecimento)
MSG_MAP = {
    "Conservador": "Bem-vindo, conservador!",
    "Moderado":    "Bem-vindo, moderado!",
    "Agressivo":   "Bem-vindo, agressivo!"
}
db = pickle.load(open(DB_FILE,"rb")) if os.path.exists(DB_FILE) else {}
detector = dlib.get_frontal_face_detector()
sp = dlib.shape_predictor(PREDICTOR)
rec = dlib.face_recognition_model_v1(RECOG)
 
# ADIÇÃO: carregar perfis (nome -> tipo de investidor)
profiles = pickle.load(open(PROF_FILE, "rb")) if os.path.exists(PROF_FILE) else {}
time.sleep(2)
cap = cv2.VideoCapture(1, cv2.CAP_DSHOW)
validando = False
ultimo = 0
cooldown = 3
print("[E]=Cadastrar  [V]=Validar ON/OFF  [Q]=Sair")
while True:
    ok, frame = cap.read()
    if not ok: break
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    rects = detector(rgb, 1)
    for r in rects:
        shape = sp(rgb, r)
        chip = dlib.get_face_chip(rgb, shape)
        vec = np.array(rec.compute_face_descriptor(chip), dtype=np.float32)
        if validando and db:
            nome, dist = "Desconhecido", 999
            for n, v in db.items():
                d = np.linalg.norm(vec - v)
                if d < dist:
                    nome, dist = n, d
            if dist > THRESH:
                nome = "Desconhecido"
            color = (0,255,0) if nome != "Desconhecido" else (0,0,255)
            cv2.rectangle(frame, (r.left(), r.top()), (r.right(), r.bottom()), color, 2)
            cv2.putText(frame, f"{nome}", (r.left(), r.top()-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
 
            # ADIÇÃO: quando reconhecido, exibir tipo de investidor e mensagem de boas-vindas
            if nome != "Desconhecido":
                tipo = profiles.get(nome, "(sem perfil)")
                msg  = MSG_MAP.get(tipo, "")
                # Mensagem curta abaixo do retângulo (evita poluir o topo)
                y_msg = min(frame.shape[0]-10, r.bottom() + 25)
                cv2.putText(frame, msg, (max(10, r.left()), y_msg),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)
            if nome != "Desconhecido" and time.time()-ultimo > cooldown:
                ultimo = time.time()
    cv2.imshow("Faces", frame)
    k = cv2.waitKey(1) & 0xFF
    if k == ord('q'): break
    if k == ord('v'): validando = not validando
    if k == ord('e') and len(rects) == 1:
        nome = input("Nome: ").strip()
        if nome:
            db[nome] = vec
            pickle.dump(db, open(DB_FILE,"wb"))
            print("Salvo:", nome)
 
            # ADIÇÃO: solicitar e salvar o tipo de investidor
            print("Tipos de Investidor: [1] Conservador  [2] Moderado  [3] Agressivo")
            tipo_raw = input("Tipo (1/2/3 ou nome): ").strip().lower()
 
            # normalização de entrada
            mapa = {
                "1": "Conservador", "conservador": "Conservador",
                "2": "Moderado",    "moderado": "Moderado",
                "3": "Agressivo",   "agressivo": "Agressivo"
            }
            tipo = mapa.get(tipo_raw, "Conservador")  # padrão seguro
            profiles[nome] = tipo
            pickle.dump(profiles, open(PROF_FILE, "wb"))
            print(f"Perfil salvo para {nome}: {tipo}")
 
cap.release()
cv2.destroyAllWindows()