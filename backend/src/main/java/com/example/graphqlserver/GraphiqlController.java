package com.example.graphqlserver;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GraphiqlController {

    // Forward requests for /graphiql and /graphiql/ to the static index.html we added
    @GetMapping({"/graphiql", "/graphiql/"})
    public String forwardGraphiql() {
        return "forward:/graphiql/index.html";
    }
}
