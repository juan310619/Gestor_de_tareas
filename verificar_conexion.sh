#!/bin/bash
# 🔍 SCRIPT DE VERIFICACIÓN - CONEXIÓN BACKEND-FRONTEND

echo "=================================================="
echo "   🔍 VERIFICACIÓN DE CONEXIÓN"
echo "=================================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[1/6]${NC} Verificando Backend..."
sleep 1

# Verifica si el backend está corriendo
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend está corriendo en puerto 8000${NC}"
else
    echo -e "${RED}❌ Backend NO está corriendo${NC}"
    echo -e "${YELLOW}Inicia el backend con:${NC}"
    echo "   uvicorn app.main:app --reload --port 8000"
fi

echo ""
echo -e "${YELLOW}[2/6]${NC} Verificando Frontend..."
sleep 1

# Verifica si el frontend está corriendo
if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend está corriendo en puerto 5173${NC}"
else
    echo -e "${RED}❌ Frontend NO está corriendo${NC}"
    echo -e "${YELLOW}Inicia el frontend con:${NC}"
    echo "   cd Fronted && npm run dev"
fi

echo ""
echo -e "${YELLOW}[3/6]${NC} Verificando CORS..."
sleep 1

# Verifica CORS
CORS_TEST=$(curl -s -X OPTIONS http://localhost:8000/ \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v 2>&1 | grep "access-control-allow-origin" | head -n1)

if [[ ! -z "$CORS_TEST" ]]; then
    echo -e "${GREEN}✅ CORS está configurado correctamente${NC}"
else
    echo -e "${RED}⚠️  CORS podría no estar bien configurado${NC}"
fi

echo ""
echo -e "${YELLOW}[4/6]${NC} Verificando archivos clave..."
sleep 1

ARCHIVOS=(
    "app/main.py"
    "Fronted/src/services/api.ts"
    "Fronted/src/components/LoginModal.tsx"
    "Fronted/src/view/Dashboard.tsx"
    "Fronted/src/view/Layout.tsx"
    "Fronted/.env"
)

MISSING=0
for archivo in "${ARCHIVOS[@]}"; do
    if [ -f "$archivo" ]; then
        echo -e "${GREEN}✅ $archivo${NC}"
    else
        echo -e "${RED}❌ FALTA: $archivo${NC}"
        MISSING=$((MISSING + 1))
    fi
done

echo ""
echo -e "${YELLOW}[5/6]${NC} Verificando endpoints API..."
sleep 1

# Test login endpoint
LOGIN_TEST=$(curl -s -X POST http://localhost:8000/api/access \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test&password=test" 2>&1)

if [[ "$LOGIN_TEST" == *"incorrect"* ]] || [[ "$LOGIN_TEST" == *"access_token"* ]]; then
    echo -e "${GREEN}✅ Endpoint /api/access está funcionando${NC}"
else
    echo -e "${RED}❌ Endpoint /api/access podría no estar disponible${NC}"
fi

echo ""
echo -e "${YELLOW}[6/6]${NC} Verificando variables de entorno..."
sleep 1

if [ -f "Fronted/.env" ]; then
    if grep -q "VITE_API_URL" "Fronted/.env"; then
        echo -e "${GREEN}✅ .env contiene VITE_API_URL${NC}"
    else
        echo -e "${RED}❌ .env no contiene VITE_API_URL${NC}"
    fi
else
    echo -e "${RED}❌ Archivo .env no existe${NC}"
fi

echo ""
echo "=================================================="
echo ""

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✅ TODOS LOS ARCHIVOS ESTÁN PRESENTES${NC}"
    echo ""
    echo -e "${GREEN}🎉 LA CONEXIÓN PARECE ESTAR LISTA${NC}"
else
    echo -e "${RED}❌ FALTAN $MISSING ARCHIVOS${NC}"
    echo ""
    echo -e "${YELLOW}Por favor, verifica los archivos faltantes${NC}"
fi

echo ""
echo "=================================================="
echo "   📋 PRÓXIMOS PASOS"
echo "=================================================="
echo ""
echo "1. Terminal 1 - Inicia el Backend:"
echo "   cd /home/jjnn/Escritorio/gestor_tareas_backend"
echo "   uvicorn app.main:app --reload --port 8000"
echo ""
echo "2. Terminal 2 - Inicia el Frontend:"
echo "   cd /home/jjnn/Escritorio/gestor_tareas_backend/Fronted"
echo "   npm run dev"
echo ""
echo "3. Abre en navegador:"
echo "   http://localhost:5173"
echo ""
echo "=================================================="
