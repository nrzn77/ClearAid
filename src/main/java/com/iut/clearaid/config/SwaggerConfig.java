package com.iut.clearaid.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@Slf4j
public class SwaggerConfig {

    @Bean
    public OpenAPI iutAPIOpenAPI() {
        log.debug("Configuring OpenAPI documentation with JWT support");

        return new OpenAPI()
                .info(new Info()
                        .title("IUT API")
                        .description("API for iut api services")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("IUT Support")
                                .email("support@iut.com")
                                .url("https://iut-oic.com/support"))
                        .license(new License()
                                .name("IUT License")
                                .url("https://iut-oic.com/license")))
                .servers(List.of(
                        new Server().url("/").description("Default Server URL")
                ))
                // Add JWT security
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        ))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }

}
