# A tiny web server that Instastack's builder builds in its end-to-end proof.
# The RUN step reports what a build step can reach: the internet should be
# reachable, the cloud metadata address and the host mesh should not.
# PROBE_TARGET, when set, is a mesh address and port to try ("[fd00::1]:8080").
FROM busybox:1.36
ARG PROBE_TARGET=""
RUN if wget -q -T 5 -O /dev/null http://example.com/; then \
      echo "probe: internet reachable"; else echo "probe: internet UNREACHABLE"; fi; \
    if wget -q -T 3 -O /dev/null http://169.254.169.254/; then \
      echo "probe: metadata REACHABLE"; else echo "probe: metadata blocked"; fi; \
    if [ -n "$PROBE_TARGET" ]; then \
      if wget -q -T 3 -O /dev/null "http://$PROBE_TARGET/"; then \
        echo "probe: mesh $PROBE_TARGET REACHABLE"; else echo "probe: mesh $PROBE_TARGET blocked"; fi; \
    fi
COPY index.html /www/index.html
EXPOSE 8080
CMD ["httpd", "-f", "-v", "-p", "8080", "-h", "/www"]
