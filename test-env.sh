#!/bin/bash
echo "Ì¥ç Testing Environment..."
curl -s http://localhost:5000/api/health >/dev/null && echo "‚úÖ Backend OK" || echo "‚ùå Backend FAIL"
curl -s http://localhost:5174 >/dev/null && echo "‚úÖ Frontend OK" || echo "‚ùå Frontend FAIL"
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5174"
