FROM alpine AS crt-builder

RUN apk --update add openssl
RUN openssl req -newkey rsa:2048 -nodes -keyout server.key.pem -x509 -days 365 -out server.crt.pem \
        -subj "/C=DE/ST=Bayern/L=München/O=Bluzy/OU=IT Department/CN=bluzy.io"
RUN chmod 755 server.key.pem

FROM quay.io/keycloak/keycloak AS idp

COPY --from=crt-builder server.key.pem /opt/keycloak/conf/
COPY --from=crt-builder server.crt.pem /opt/keycloak/conf/

ENV KC_HTTPS_CERTIFICATE_FILE=/opt/keycloak/conf/server.crt.pem
ENV KC_HTTPS_CERTIFICATE_KEY_FILE=/opt/keycloak/conf/server.key.pem
ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin

HEALTHCHECK --interval=20s --timeout=3s CMD curl -f http://localhost:8080/ || exit 1

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
