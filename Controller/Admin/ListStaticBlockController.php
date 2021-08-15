<?php

/**
 * @copyright EveryWorkflow. All rights reserved.
 */

declare(strict_types=1);

namespace EveryWorkflow\StaticBlockBundle\Controller\Admin;

use EveryWorkflow\CoreBundle\Annotation\EWFRoute;
use EveryWorkflow\DataGridBundle\Model\DataGridInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ListStaticBlockController extends AbstractController
{
    protected DataGridInterface $dataGrid;

    public function __construct(DataGridInterface $dataGrid)
    {
        $this->dataGrid = $dataGrid;
    }

    /**
     * @EWFRoute(
     *     admin_api_path="cms/static-block",
     *     name="admin.cms.static_block",
     *     priority=10,
     *     methods="GET"
     * )
     */
    public function __invoke(Request $request): JsonResponse
    {
        $dataGrid = $this->dataGrid->setFromRequest($request);
        return (new JsonResponse())->setData($dataGrid->toArray());
    }
}
