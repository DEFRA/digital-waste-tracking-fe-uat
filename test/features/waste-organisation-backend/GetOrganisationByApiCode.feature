Feature: Get organisation by API Code endpoint validation

    @local
    Scenario: defraOrganisationId must be correctly returned in the response for a valid and active apiCode
        Given a waste receiving organisation is registered
        # When the get-organisation-by-apiCode endpoint is called with apiCode of above organisation
        # Then defraOrganisationId of the waste receiving organisation must be correctly returned in the response